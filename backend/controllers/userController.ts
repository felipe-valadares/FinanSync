// controllers/userController.ts
import { Request, Response } from 'express';
import UserService from '../services/userService'; // Import UserService

class UserController {
    /**
     * Handles fetching a user by their unique ID.
     * @param req - The incoming request object.
     * @param res - The outgoing response object.
     */
    static async getUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Fetch the user from the database
            const user = await UserService.getUserById(id);

            // If the user doesn't exist, return a 404 response
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return the user details as JSON
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company_id: user.company_id,
                created_at: user.created_at,
                updated_at: user.updated_at,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching user' });
        }
    }

    /**
     * Handles fetching all users.
     * @param req - The incoming request object.
     * @param res - The outgoing response object.
     */
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching users' });
        }
    }

    /**
     * Handles creating a new user.
     * @param req - The incoming request object.
     * @param res - The outgoing response object.
     */
    static async createUser(req: Request, res: Response) {
        const { name, email, password, role, company_id }: { name: string, email: string, password: string, role?: string, company_id?: string } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        try {
            // Use the UserService to create a new user
            const newUser = await UserService.createUser({ name, email, password, role, company_id });

            // Return the newly created user details
            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                company_id: newUser.company_id,
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || 'Error creating user' });
        }
    }

    /**
     * Handles updating an existing user.
     * @param req - The incoming request object.
     * @param res - The outgoing response object.
     */
    static async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const data: Partial<{ name: string, email: string, password: string, role: string, company_id: string }> = req.body;

        try {
            // Use the UserService to update the user
            const updatedUser = await UserService.updateUser(id, data);

            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                company_id: updatedUser.company_id,
                updated_at: updatedUser.updated_at,
            });
        } catch (error: any) {
            if (error.message === 'User not found') {
                return res.status(404).json({ error: 'User not found' });
            }
            console.error(error);
            res.status(500).json({ error: error.message || 'Error updating user' });
        }
    }

    /**
     * Handles deleting a user by their unique ID.
     * @param req - The incoming request object.
     * @param res - The outgoing response object.
     */
    static async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Use the UserService to delete the user
            const success = await UserService.deleteUser(id);

            if (success) {
                return res.status(204).send(); // No content
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting user' });
        }
    }
}

export default UserController;
