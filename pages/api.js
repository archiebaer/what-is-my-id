import axios from "axios";

export default async (req, res) => {
    try {
        if (typeof req.query.id === "string") {
            const user = (await axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(req.query.id)}`)).data;
            res.json({text: `${user.name}#${user.tag}`});
        } else if (
            typeof req.query.name === "string" &&
            typeof req.query.tag === "string"
        ) {
            const user = (await axios.get(
                `https://horizon.alles.cc/nametag/${encodeURIComponent(req.query.name)}/${encodeURIComponent(req.query.tag)}`
            )).data;
            res.json({text: user.id});
        } else res.status(400).json({err: "badRequest"});
    } catch (err) {
        res.status(400).json({err: "missingResource"});
    }
};
