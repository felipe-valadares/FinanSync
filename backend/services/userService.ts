// services/userService.ts
import prisma from '../db/prismaClient';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

class UserService {
    /**
     * Fetches a user by their unique ID.
     */
    static async getUserById(id: string): Promise<User | null> {
        try {
            console.log('id', id);
            return await prisma.users.findUnique({ where: { id } });
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Error fetching user');
        }
    }

    /**
     * Fetches all users in the database.
     */
    static async getAllUsers(): Promise<User[]> {
        try {
            return await prisma.users.findMany();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Error fetching users');
        }
    }

    /**
     * Creates a new user in the database.
     */
    static async createUser(data: { name: string; email: string; password: string; role?: string; company_id?: string; }): Promise<User> {
        const { name, email, password, role, company_id } = data;

        // Check if the email is already registered
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) throw new Error('Email is already registered');

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser: User = {
                id: uuidv4(),
                name,
                email,
                password: hashedPassword,
                role: role || 'user',
                company_id: company_id || '',
                created_at: new Date(),
                updated_at: new Date(),
            };

            return await prisma.users.create({ data: newUser });
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error creating user');
        }
    }

    /**
     * Updates an existing user in the database.
     */
    static async updateUser(id: string, data: Partial<{ name: string, email: string, password: string, new_password: string, role: string, company_id: string }>): Promise<User> {
        try {
            const existingUser = await prisma.users.findUnique({ where: { id } });
            if (!existingUser) throw new Error('User not found');

            const updatedData: Partial<User> = {
                ...data.name && { name: data.name },
                ...data.email && { email: data.email },
                ...data.role && { role: data.role },
                ...data.company_id && { company_id: data.company_id },
                ...(data.new_password && {
                    password: await bcrypt.hash(data.new_password, 10),
                }),
                updated_at: new Date(),
            };

            if (data.new_password && !data.password) throw new Error('Old password is required');
            if (data.new_password && !(await bcrypt.compare(data.password, existingUser.password))) throw new Error('Password is incorrect');

            return await prisma.users.update({ where: { id }, data: updatedData });
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user');
        }
    }

    /**
     * Deletes a user by their unique ID.
     */
    static async deleteUser(id: string): Promise<boolean> {
        try {
            await prisma.users.delete({ where: { id } });
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Error deleting user');
        }
    }
}

export default UserService;
