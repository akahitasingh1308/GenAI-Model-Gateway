class IntentPlanner:

    def create_plan(self, query: str, task_type: str):

        query = query.lower()

        plan = []
        added = set()

        def add_task(task):

            if task not in added:

                plan.append({
                    "task": task
                })

                added.add(task)

        if "analyze" in query or task_type == "reasoning":
            add_task("reasoning")

        if "summarize" in query or task_type == "summarization":
            add_task("summarization")

        if "code" in query or task_type == "code_generation":
            add_task("code_generation")

        if "sql" in query or task_type == "sql_generation":
            add_task("sql_generation")

        if "email" in query or task_type == "email_drafting":
            add_task("email_drafting")

        if "extract" in query or task_type == "data_extraction":
            add_task("data_extraction")

        if not plan:
            add_task(task_type)

        for index, step in enumerate(plan):

            step["order"] = index + 1

        return plan




    