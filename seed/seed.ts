import { PrismaClient } from '@prisma/client';
import { cityRepository } from '../src/repositories/city.repository';
import { skillRepository } from '../src/repositories/skill.repository';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

async function seed() {
    try {
        const citiesFilePath = path.join(__dirname, 'cities.csv');
        const skillsFilePath = path.join(__dirname, 'skills.csv');

        const citiesFileContent = await fs.readFile(citiesFilePath, 'utf-8');
        const cities = citiesFileContent.trim().split('\n').map(city => city.trim());

        for (const cityName of cities) {
            const existingCity = await cityRepository.getCityByName(cityName);
            if (!existingCity) {
                const createdCity = await cityRepository.createCity(cityName);
                console.log(`Місто "${createdCity.name}" додано.`);
            } else {
                console.log(`Місто "${existingCity.name}" вже існує.`);
            }
        }

        const skillsFileContent = await fs.readFile(skillsFilePath, 'utf-8');
        const skills = skillsFileContent.trim().split('\n').map(skill => skill.trim());

        for (const skillName of skills) {
            const existingSkill = await skillRepository.getSkillByName(skillName);
            if (!existingSkill) {
                const createdSkill = await skillRepository.createSkill(skillName);
                console.log(`Навичку "${createdSkill.name}" додано.`);
            } else {
                console.log(`Навичка "${existingSkill.name}" вже існує.`);
            }
        }

        console.log('Наповнення бази даних завершено.');
    } catch (error) {
        console.error('Помилка при наповненні бази даних:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed()
    .then(() => console.log('Скрипт виконано успішно.'))
    .catch((e) => {
        console.error('Помилка виконання скрипту:', e);
        process.exit(1);
    });