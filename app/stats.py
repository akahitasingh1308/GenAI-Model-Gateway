class StatsTracker:
    def __init__(self):
        self.total_requests = 0
        self.success = 0
        self.failed = 0

    def log(self, status: str):
        self.total_requests += 1

        if status == "success":
            self.success += 1
        else:
            self.failed += 1

    def get_stats(self):
        return {
            "total_requests": self.total_requests,
            "success": self.success,
            "failed": self.failed
        }
    