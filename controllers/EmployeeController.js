import Employee from '../models/Employee.js';

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
    // Получение всех сотрудников
    async getAllEmployees(req, res) {
        try {
            const employees = await Employee.find();
            res.json(employees);
        } catch (error) {
            console.error('Ошибка при получении всех сотрудников:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    // Получение одного сотрудника по ID
    async getOneEmployee(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }
            res.json(employee);
        } catch (error) {
            console.error('Ошибка при получении сотрудника:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    // Создание нового сотрудника
    async createEmployee(req, res) {
        try {
            const { name, position, contact, image, countries, regions } = req.body;

            // Проверка обязательных полей
            if (!name || !position || !contact || !image) {
                return res.status(400).json({ message: "Все обязательные поля должны быть заполнены" });
            }

            const employee = new Employee({
                name,
                position,
                contact,
                image, // Ожидается строка Base64
                countries: countries || [],
                regions: regions || [],
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
            const { name, position, contact, image, countries, regions } = req.body;

            // Формируем данные для обновления
            const updateData = {
                name,
                position,
                contact,
                image,
                countries: countries || [],
                regions: regions || [],
            };

            const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!employee) {
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }
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
            if (!employee) {
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }
            res.json({ message: 'Сотрудник удален' });
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    // Получение сотрудников по стране и региону
    async getEmployeesByCountryAndRegion(req, res) {
        const { country, region } = req.params;

        const normalizedCountry = countryMap[country.toLowerCase()];
        const fullRegionName = region ? regionMap[region.toLowerCase()] : null;

        if (!normalizedCountry) {
            return res.status(400).json({ message: "Некорректная страна" });
        }

        const criteria = { countries: normalizedCountry };
        if (fullRegionName) {
            criteria.regions = fullRegionName;
        }

        try {
            const employees = await Employee.find(criteria);
            res.json(employees);
        } catch (error) {
            console.error('Ошибка при получении сотрудников по стране и региону:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new EmployeeController();
