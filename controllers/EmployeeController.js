import Employee from '../models/Employee.js';

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
            // Преобразуем JSON-строки в массивы, если они переданы в таком формате
            const countries = JSON.parse(req.body.countries || '[]');
            const regions = JSON.parse(req.body.regions || '[]');

            const employee = new Employee({
                name: req.body.name,
                position: req.body.position,
                contact: req.body.contact,
                image: req.file ? `../uploads/${req.file.filename}` : '', // Ссылка на изображение, если загружено
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
            // Преобразуем JSON-строки в массивы, если они переданы в таком формате
            const countries = JSON.parse(req.body.countries || '[]');
            const regions = JSON.parse(req.body.regions || '[]');
            
            const updateData = {
                name: req.body.name,
                position: req.body.position,
                contact: req.body.contact,
                countries,
                regions,
            };

            // Обновляем поле изображения только если оно присутствует
            if (req.file) {
                updateData.image = `../uploads/${req.file.filename}`;
            }

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
}

export default new EmployeeController();
