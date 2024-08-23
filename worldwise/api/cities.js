import fs from "fs";
import path from "path";

const initData = {
    "cities": [
        {
            "cityName": "Berlin",
            "country": "Germany",
            "emoji": "DE",
            "date": "2027-02-12T09:24:11.863Z",
            "notes": "Amazing 😃",
            "position": {
                "lat": 52.53586782505711,
                "lng": 13.376933665713324
            },
            "id": "98443197"
        },
        {
            "id": "805b",
            "cityName": "Bardallur",
            "country": "Spain",
            "emoji": "es",
            "date": "2024-07-12T13:02:30.028Z",
            "notes": "ttt",
            "position": {
                "lat": "41.6916380537994",
                "lng": "-1.1614256152993163"
            }
        },
        {
            "id": "10aa",
            "cityName": "Castrocalbon",
            "country": "Spain",
            "emoji": "es",
            "date": "2024-07-15T06:55:09.651Z",
            "notes": "hello",
            "position": {
                "lat": "42.18170486317722",
                "lng": "-6.064453125000001"
            }
        },
        {
            "id": "23c4",
            "cityName": "Mogadouro",
            "country": "Portugal",
            "emoji": "pt",
            "date": "2024-07-15T13:02:58.720Z",
            "notes": "hello",
            "position": {
                "lat": "41.36487852784101",
                "lng": "-6.564331054687501"
            }
        }
    ]
}


export default function handler(req, res) {

    const method = req.method;
    const { id } = req.query;

    const filePath = path.join(process.cwd(), "src/data", "cities.json");
    const writePath = path.join("/tmp", "cities.json");

    // Read the JSON file
    const readJsonFile = () => {
        const jsonData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(jsonData);
        // const jsonData = initData;
        // return jsonData
    };

    // Write to the JSON file
    const writeJsonFile = (data) => {
        fs.writeFileSync(writePath, JSON.stringify(data, null, 2));
    };

    try {
        let jsonData = readJsonFile();

        switch (method) {
            case "GET":
                if (id) {
                    // Retrieve a single city by ID
                    const city = jsonData.cities.find((city) => city.id === id);
                    if (city) {
                        res.status(200).json(city);
                    } else {
                        res.status(404).json({ error: "City not found" });
                    }
                } else {
                    // Retrieve all cities
                    res.status(200).json(jsonData);
                }
                break;
            case "POST": {
                // Create a new city
                const newCity = req.body;
                jsonData.cities.push(newCity);
                writeJsonFile(jsonData);
                res.status(201).json(newCity);
                break;
            }

            case "DELETE":
                if (id) {
                    // Delete a city by ID
                    const cityIndex = jsonData.cities.findIndex((city) => city.id === id);
                    if (cityIndex === -1) {
                        res.status(404).json({ error: "City not found" });
                    } else {
                        jsonData.cities.splice(cityIndex, 1);
                        writeJsonFile(jsonData);
                        res.status(200).json({ message: "City deleted successfully" });
                    }
                } else {
                    res.status(400).json({ error: "City ID is required" });
                }
                break;
            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}