import Employee from '../models/Employee.js';

class EmployeeController {
    async getAllEmployees(req, res) {
        try {
            const employees = await Employee.find();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOneEmployee(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createEmployee(req, res) {
        const { name, position, contact, country, region } = req.body;
        const image = req.file ? `../uploads/${req.file.filename}` : '';
    
        try {
            const employee = new Employee({ name, position, contact, image, country, region });
            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            console.error('Error creating employee:', error.message);
            res.status(400).json({ message: error.message });
        }
    }
    
    async updateEmployee(req, res) {
        const { name, position, contact, country, region } = req.body;
        const image = req.file ? `../uploads/${req.file.filename}` : req.body.image; // Обновляем только если есть новое изображение

        try {
            const employee = await Employee.findByIdAndUpdate(req.params.id, { name, position, contact, image, country, region }, { new: true });
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json(employee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
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
