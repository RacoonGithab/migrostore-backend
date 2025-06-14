import { PdfTemplateDataDto } from "../../types/dto/resume.dto";
import {calculateAge, formatDate} from "../date-helpers.template";

export const createResumeHtmlTemplate = (data: PdfTemplateDataDto): string => {
    const age = calculateAge(data.dateOfBirth);

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Резюме ${data.firstName} ${data.lastName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(to right, #fdfbfb, #ebedee);
            color: #2c3e50;
            padding: 40px;
            max-width: 800px;
            margin: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            line-height: 1.6;
        }
        h1 {
            font-size: 36px;
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
            border-bottom: 2px solid #2980b9;
            padding-bottom: 10px;
            letter-spacing: 1px;
        }
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            gap: 20px;
        }
        .main-info {
            flex: 1;
        }
        .photo {
            flex-shrink: 0;
            width: 140px; /* Фиксированная ширина для фото */
            height: 140px; /* Фиксированная высота для фото */
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden; /* Обрезка, если изображение больше */
            border-radius: 12px;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .photo img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Заполнение контейнера без искажений */
        }
        .placeholder-photo-svg {
            width: 100%; /* Заполнение контейнера */
            height: 100%; /* Заполнение контейнера */
            fill: #95a5a6;
            padding: 10px; /* Отступ внутри для SVG */
            box-sizing: border-box; /* Учитываем padding в размере */
        }
        h2 {
            font-size: 20px;
            margin-top: 15px; /* Добавим небольшой отступ сверху */
            margin-bottom: 8px;
            color: #34495e;
        }
        p {
            margin: 0 0 5px;
        }
        .section {
            background: #ffffff;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #3498db;
            border-radius: 10px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
            transition: background 0.3s ease;
        }
        .section:hover {
            background: #f2f6f9;
        }
        .section h2 {
            margin-bottom: 10px;
            font-weight: 700;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill {
            background: linear-gradient(to right, #3498db, #2980b9);
            padding: 6px 14px;
            font-size: 14px;
            border-radius: 20px;
            color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
        }
        .skill:hover {
            transform: scale(1.05);
        }
        .item-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .item-list li {
            margin-bottom: 15px;
            padding-left: 15px;
            position: relative;
        }
        .item-list li:last-child {
            margin-bottom: 0;
        }
        .item-list li::before {
            content: '•';
            color: #3498db;
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        .item-list h3 {
            font-size: 18px;
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 5px;
        }
        .item-list p {
            font-size: 15px;
            color: #34495e;
        }
    </style>
</head>
<body>
    <h1>Резюме - ${data.firstName} ${data.lastName}</h1>

    <div class="header-container">
        <div class="main-info">
            <div class="section">
                <h2>Контактная информация:</h2>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Телефон:</strong> ${data.phoneNumber}</p>
                ${data.country ? `<p><strong>Страна:</strong> ${data.country}</p>` : ''}
            </div>
            <div class="section">
                <h2>Основная информация:</h2>
                <p><strong>Имя:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Возраст:</strong> ${age} лет</p>
                <p><strong>Дата рождения:</strong> ${formatDate(data.dateOfBirth)}</p>
                ${data.qualification ? `<p><strong>Квалификация:</strong> ${data.qualification}</p>` : ''}
            </div>
        </div>
        <div class="photo">
            ${data.photoUrl ? `
                <img src="${data.photoUrl}" alt="Фото пользователя">
            ` : `
                <svg class="placeholder-photo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
                </svg>
            `}
        </div>
    </div>

    ${data.aboutMe ? `
    <div class="section">
        <h2>О себе:</h2>
        <p>${(data.aboutMe || '').replace(/\n/g, '<br>')}</p>
    </div>` : ''}

    <div class="section">
        <h2>Навыки:</h2>
        <div class="skills">
            ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>

    ${data.workExperiences && data.workExperiences.length > 0 ? `
    <div class="section">
        <h2>Опыт работы:</h2>
        <ul class="item-list">
            ${data.workExperiences.map(exp => `
                <li>
                    <h3>${exp.position} в ${exp.companyName}</h3>
                    <p>${formatDate(exp.startDate)} – ${exp.isCurrentWork ? 'Настоящее время' : formatDate(exp.endDate)}</p>
                </li>
            `).join('')}
        </ul>
    </div>` : ''}

    ${data.educations && data.educations.length > 0 ? `
    <div class="section">
        <h2>Образование:</h2>
        <ul class="item-list">
            ${data.educations.map(edu => `
                <li>
                    <h3>${edu.specialty} (${edu.institutionName})</h3>
                    <p>${formatDate(edu.startDate)} – ${edu.isCurrentStudy ? 'Настоящее время' : formatDate(edu.endDate)}</p>
                </li>
            `).join('')}
        </ul>
    </div>` : ''}

    ${data.languageSkills && data.languageSkills.length > 0 ? `
    <div class="section">
        <h2>Владение языками:</h2>
        <ul class="item-list">
            ${data.languageSkills.map(lang => `
                <li>
                    <h3>${lang.language}</h3>
                    <p>Уровень: ${lang.level}</p>
                </li>
            `).join('')}
        </ul>
    </div>` : ''}

</body>
</html>
`;
};