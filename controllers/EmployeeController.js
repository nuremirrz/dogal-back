import mongoose from "mongoose";
import Employee from "../models/Employee.js";

const countryMap = {
    kyrgyzstan: "Кыргызстан",
    kazakhstan: "Казахстан",
    russia: "Россия",
    uzbekistan: "Узбекистан",
};

const regionMap = {
    batken: "Баткенская область",
    chuy: "Чуйская область",
    osh: "Ошская область",
    "issyk-kul": "Иссык-Кульская область",
    talas: "Таласская область",
    jalalabad: "Джалал-Абадская область",
    naryn: "Нарынская область",
};

class EmployeeController {
    async getAllEmployees(req, res) {
        try {
            const employees = await Employee.find();
            res.json(employees);
        } catch (error) {
            console.error("Ошибка при получении всех сотрудников:", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getOneEmployee(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Некорректный ID" });
        }
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: "Сотрудник не найден" });
            }
            res.json(employee);
        } catch (error) {
            console.error("Ошибка при получении сотрудника:", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async createEmployee(req, res) {
        try {
            const { name, position, contact, image, countries, regions } = req.body;
            if (!name || !position || !contact) {
                return res.status(400).json({ message: "Все обязательные поля должны быть заполнены" });
            }

            const employee = new Employee({
                name,
                position,
                contact,
                image,
                countries: countries || [],
                regions: regions || [],
            });

            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            console.error("Ошибка при создании сотрудника:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async updateEmployee(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Некорректный ID" });
        }
        try {
            const { name, position, contact, image, countries, regions } = req.body;
            const updateData = { name, position, contact, image, countries, regions };

            const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!employee) {
                return res.status(404).json({ message: "Сотрудник не найден" });
            }
            res.json(employee);
        } catch (error) {
            console.error("Ошибка при обновлении сотрудника:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteEmployee(req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Некорректный ID" });
        }
        try {
            const employee = await Employee.findByIdAndDelete(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: "Сотрудник не найден" });
            }
            res.json({ message: "Сотрудник удален" });
        } catch (error) {
            console.error("Ошибка при удалении сотрудника:", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeesByCountryAndRegion(req, res) {
        const { country, region } = req.params;
        const normalizedCountry = country ? countryMap[country.toLowerCase()] : null;
        const fullRegionName = region ? regionMap[region.toLowerCase()] : null;

        if (!normalizedCountry) {
            return res.status(400).json({ message: "Некорректная или отсутствующая страна" });
        }

        const criteria = { countries: normalizedCountry };
        if (fullRegionName) {
            criteria.regions = fullRegionName;
        }

        try {
            const employees = await Employee.find(criteria);
            res.json(employees);
        } catch (error) {
            console.error("Ошибка при получении сотрудников по стране и региону:", error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new EmployeeController();
