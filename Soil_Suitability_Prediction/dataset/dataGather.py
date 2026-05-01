import requests
import pandas as pd
import time
from tqdm import tqdm
import itertools

LATS = [i/10 for i in range(-10, 0, 1)]   
LONS = [i/10 for i in range(35, 45, 1)]   
LOCATIONS = list(itertools.product(LATS, LONS))[:100]  

START_DATE = "2022-01-01"
END_DATE = "2022-12-31"  

PARAMETERS = [
    "TS",            
    "T2M",           
    "T2M_MAX",       
    "T2M_MIN",       
    "PRECTOT",       
    "RH2M",          
    "WS2M",          
    "ALLSKY_SFC_SW_DWN",      
    "ALLSKY_SFC_PAR_TOT",     
    "QV2M",          
    "PS",            
    "T2MDEW",        
    "WS10M",         
]

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
COMMUNITY = "AG"
OUTPUT_CSV = "nasa_power_soil_health_target.csv"
REQUEST_DELAY = 1.2  

def compute_soil_health_index(row):
    t2m = (float(row.get("T2M", 0)) - 0) / (40 - 0)       
    prectot = float(row.get("PRECTOT", 0)) / 20           
    rh2m = float(row.get("RH2M", 0)) / 100                
    ts = (float(row.get("TS", 0)) - 0) / (40 - 0)         
    qv2m = float(row.get("QV2M", 0)) / 30                 
    
    index = (
        0.20 * (1 - abs(t2m - 0.5)) +      
        0.25 * min(prectot, 1.0) +         
        0.20 * rh2m +                      
        0.20 * (1 - abs(ts - 0.5)) +       
        0.15 * min(qv2m, 1.0)              
    )
    return max(0, min(index, 1))

def compute_soil_health_class(index):
    if index >= 0.67:
        return "Healthy"
    elif index >= 0.34:
        return "Moderate"
    else:
        return "Degraded"

def fetch_power_data(lat, lon, start, end, parameters, community):
    params = {
        "latitude": lat,
        "longitude": lon,
        "start": start.replace("-", ""),
        "end": end.replace("-", ""),
        "parameters": ",".join(parameters),
        "community": community,
        "format": "JSON"
    }
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()

def parse_power_response(json_data, lat, lon):
    records = []
    try:
        daily_data = json_data['properties']['parameter']
        dates = next(iter(daily_data.values())).keys()
        for date in dates:
            row = {"latitude": lat, "longitude": lon, "date": date}
            for param in daily_data:
                row[param] = daily_data[param].get(date, None)
            index = compute_soil_health_index(row)
            row["soil_health_index"] = index
            row["soil_health_class"] = compute_soil_health_class(index)
            records.append(row)
    except Exception as e:
        print(f"Error parsing data for ({lat}, {lon}): {e}")
    return records

def main():
    all_records = []
    for lat, lon in tqdm(LOCATIONS, desc="Fetching NASA POWER data"):
        try:
            json_data = fetch_power_data(lat, lon, START_DATE, END_DATE, PARAMETERS, COMMUNITY)
            records = parse_power_response(json_data, lat, lon)
            all_records.extend(records)
        except Exception as e:
            print(f"Error fetching data for ({lat}, {lon}): {e}")
        time.sleep(REQUEST_DELAY)  

    df = pd.DataFrame(all_records)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"Data saved to {OUTPUT_CSV}. Rows: {len(df)}, Columns: {len(df.columns)}")
    print("\nColumns:")
    print(list(df.columns))
    print("\nTarget columns for your model:")
    print(" - soil_health_index (continuous, 0-1)")
    print(" - soil_health_class (categorical: Healthy / Moderate / Degraded)")

if __name__ == "__main__":
    main()