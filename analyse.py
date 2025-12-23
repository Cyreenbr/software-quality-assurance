import requests
import csv

# CONFIG
ORGANIZATION = "ql2025"
PROJECT_KEY = "ql2025"
METRICS = "duplicated_lines,ncloc,complexity,cognitive_complexity,functions"
PAGE_SIZE = 500

url = "https://sonarcloud.io/api/measures/component_tree"

params = {
    "component": PROJECT_KEY,
    "metricKeys": METRICS,
    "ps": PAGE_SIZE,
    "organization": ORGANIZATION,
    "p": 1
}

all_components = []

while True:
    response = requests.get(url, params=params)
    data = response.json()

    # récupération des composants
    components = data.get("components", [])
    all_components.extend(components)

    # pagination
    paging = data.get("paging", {})
    if params["p"] >= paging.get("total", 1):
        break
    params["p"] += 1

# Écriture du CSV
with open("sonar_modularity_metrics.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["file", "duplicated_lines", "ncloc", "complexity", "cognitive_complexity", "functions"])

    for comp in all_components:
        measures = {m["metric"]: m.get("value", "0") for m in comp.get("measures", [])}
        
        writer.writerow([
            comp.get("path", comp.get("name")),
            measures.get("duplicated_lines", 0),
            measures.get("ncloc", 0),
            measures.get("complexity", 0),
            measures.get("cognitive_complexity", 0),
            measures.get("functions", 0)
        ])

print("CSV exporté : sonar_modularity_metrics.csv")
