import express from "express";
import cors from "cors";
import pool from "./db";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/data", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tu_tabla");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

app.listen(5000, () => {
    console.log("Servidor corriendo en http://localhost:5000");
});
