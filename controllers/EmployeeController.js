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
    naryn: "Нарынская область"
};
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
    // async getEmployeesByCountryAndRegion(req, res) {
    //     const { country, region } = req.params;

    //     // Преобразуем страну и регион из английского в русский формат
    //     const normalizedCountry = countryMap[country.toLowerCase()];
    //     const fullRegionName = region ? regionMap[region.toLowerCase()] : null;

    //     // Если страна или регион не найдены в сопоставлении, вернем ошибку
    //     if (!normalizedCountry || (region && !fullRegionName)) {
    //         return res.status(400).json({ message: "Некорректная страна или регион" });
    //     }

    //     // Формируем критерии для поиска в базе данных
    //     const criteria = { countries: normalizedCountry };
    //     if (fullRegionName) {
    //         criteria.regions = fullRegionName;
    //     }

    //     try {
    //         const employees = await Employee.find(criteria);
    //         res.json(employees);
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // }
    async getEmployeesByCountryAndRegion(req, res) {
        const { country, region } = req.params;
    
        // Преобразуем страну и регион из английского в русский формат
        const normalizedCountry = countryMap[country.toLowerCase()];
        const fullRegionName = region ? regionMap[region.toLowerCase()] : null;
    
        // Если страна не найдена в сопоставлении, вернем ошибку
        if (!normalizedCountry) {
            return res.status(400).json({ message: "Некорректная страна" });
        }
    
        // Формируем критерии для поиска в базе данных
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
