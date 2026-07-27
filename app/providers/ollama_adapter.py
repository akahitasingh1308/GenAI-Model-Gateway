"""Ollama provider adapter.

Calls a locally running Ollama server (http://localhost:11434). If Ollama is
not running or the request fails, raises ``ProviderError`` so the router can
fall back to another model (Rule 7).

Set the env var GATEWAY_OLLAMA_MOCK=1 to force a deterministic mock response
without a running Ollama server — handy for demos and CI where Ollama is not
installed.
"""
from __future__ import annotations

import os
from typing import Any, Dict

import requests

from .base import BaseProvider, ProviderError

OLLAMA_BASE_URL = os.environ.get("GATEWAY_OLLAMA_URL", "http://localhost:11434")
OLLAMA_TIMEOUT_S = float(os.environ.get("GATEWAY_OLLAMA_TIMEOUT", "30"))
# Mock is ON by default; set GATEWAY_OLLAMA_MOCK=0 to make real Ollama calls.
OLLAMA_MOCK = os.environ.get("GATEWAY_OLLAMA_MOCK", "1") == "1"
# Optional override so you can point at whatever model `ollama list` shows
# (e.g. "llama3.2:latest") without editing config/models.yaml.
OLLAMA_MODEL_OVERRIDE = os.environ.get("GATEWAY_OLLAMA_MODEL")


class OllamaProvider(BaseProvider):
    def __init__(self, model_cfg: Dict[str, Any]) -> None:
        super().__init__(model_cfg)
        # Precedence: env override > models.yaml > "llama3" default.
        self.ollama_model = (
            OLLAMA_MODEL_OVERRIDE or model_cfg.get("ollama_model", "llama3")
        )

    def _generate(self, query: str, task_type: str) -> str:
        if OLLAMA_MOCK:
            return self._mock_response(query, task_type)
        return self._call_ollama(query)

    # ------------------------------------------------------------------ #
    def _call_ollama(self, query: str) -> str:
        try:
            resp = requests.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={"model": self.ollama_model, "prompt": query, "stream": False},
                timeout=OLLAMA_TIMEOUT_S,
            )
            resp.raise_for_status()
            data = resp.json()
            text = data.get("response", "").strip()
            if not text:
                raise ProviderError("Ollama returned an empty response")
            return text
        except (requests.RequestException, ValueError) as exc:
            raise ProviderError(f"Ollama call failed: {exc}") from exc

    def _mock_response(self, query: str, task_type: str) -> str:
        """Deterministic stand-in so demos work without a live Ollama server."""
        snippet = query.strip()[:120]
        if task_type == "summarization":
            return (
                "1. The text describes a customer-reported issue.\n"
                "2. The likely cause relates to the product/service mentioned.\n"
                "3. Suggested next step: acknowledge and route to the right team."
            )
        if task_type == "reasoning":
            return (
                f"[ollama_llama3] Reasoning over: \"{snippet}\"\n"
                "Step 1: Identify the key facts.\n"
                "Step 2: Apply the relevant rule.\n"
                "Conclusion: a reasoned answer based on the above."
            )
        if task_type == "data_extraction":
            return '{"entities": ["example_entity"], "fields": {"status": "extracted"}}'
        return f"[ollama_llama3 mock] Response to: \"{snippet}\""
    



        