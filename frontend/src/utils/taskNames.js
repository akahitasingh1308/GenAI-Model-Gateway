export function getTaskDisplayName(task) {
    const names = {
        "short_qa": "Short Question Answering",
        "summarization": "Document Summarization",
        "reasoning": "Advanced Reasoning",
        "code_generation": "Code Generation",
        "sql_generation": "SQL Generation",
        "email_drafting": "Email Drafting",
        "data_extraction": "Data Extraction",
        "classification": "Classification"
    };
    return names[task] || task;
}