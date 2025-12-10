import fs from "fs";
import path from "path";

export const loadEmailTemplate = (fileName: string, replacements: Record<string, string>) => {
    const filePath = path.join(__dirname, "..", "templates", "email", fileName);

    let template = fs.readFileSync(filePath, "utf8");

    for (const key in replacements) {
        template = template.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    }

    return template;
};
