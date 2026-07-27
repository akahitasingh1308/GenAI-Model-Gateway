export function getModelDisplayName(model) {
  const names = {
    mock_fast: "Lite Chat Model",
    mock_premium: "Reasoning Model",
    ollama_llama3: "Llama 3.2 Fallback",
    llama3: "Llama 3.2",
    llama3_2: "Llama 3.2"
  };
  return names[model] || model;
}
