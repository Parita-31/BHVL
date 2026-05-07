def detect(text):
    if "help" in text.lower():
        return "CRISIS"
    return "NORMAL"