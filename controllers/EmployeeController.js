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
        const { name, position, contact, image } = req.body;
        try {
            const employee = new Employee({ name, position, contact, image });
            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateEmployee(req, res) {
        try {
            const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
