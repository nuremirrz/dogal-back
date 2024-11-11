import Employee from '../models/Employee.js';

// Вспомогательная функция для преобразования первой буквы строки в верхний регистр
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

class EmployeeController {
    // Получение всех сотрудников
    async getAllEmployees(req, res) {
        try {
            const employees = await Employee.find();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Получение одного сотрудника по ID
    async getOneEmployee(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Создание нового сотрудника
    async createEmployee(req, res) {
        try {
            const countries = req.body.countries || [];
            const regions = req.body.regions || [];

            const employee = new Employee({
                name: req.body.name,
                position: req.body.position,
                contact: req.body.contact,
                image: req.body.image || '', // Принимаем URL изображения напрямую
                countries,
                regions,
            });

            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            console.error('Ошибка при создании сотрудника:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

    // Обновление данных сотрудника
    async updateEmployee(req, res) {
        try {
            const countries = req.body.countries || [];
            const regions = req.body.regions || [];

            const updateData = {
                name: req.body.name,
                position: req.body.position,
                contact: req.body.contact,
                countries,
                regions,
                image: req.body.image || ''
            };

            const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json(employee);
        } catch (error) {
            console.error('Ошибка при обновлении сотрудника:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

    // Удаление сотрудника
    async deleteEmployee(req, res) {
        try {
            const employee = await Employee.findByIdAndDelete(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ message: 'Employee deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Получение сотрудников по стране и региону
    async getEmployeesByCountryAndRegion(req, res) {
        const { country, region } = req.params;

        const normalizedCountry = capitalizeFirstLetter(country);

        const regionNames = {
            kazakhstan: "Казахстан",
            russia: "Россия",
            batken: "Баткенская область",
            chuy: "Чуйская область",
            osh: "Ошская область",
            "issyk-kul": "Иссык-Кульская область",
            talas: "Таласская область",
            jalalabad: "Джалал-Абадская область",
            naryn: "Нарынская область"
        };

        const normalizedRegion = region ? region.toLowerCase() : null;
        const fullRegionName = regionNames[normalizedRegion];

        const criteria = { countries: normalizedCountry };
        if (fullRegionName) {
            criteria.regions = fullRegionName;
        }

        try {
            const employees = await Employee.find(criteria);
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new EmployeeController();
