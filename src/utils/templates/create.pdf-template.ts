import {PdfTemplateDataDto} from "../../types/dto/resume.dto";

export const createResumeHtmlTemplate = (data: PdfTemplateDataDto): string => {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Резюме</title>
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
        .container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            gap: 20px;
        }
        .info {
            flex: 1;
        }
        .photo img {
            max-width: 140px;
            height: auto;
            border-radius: 12px;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .placeholder-photo-svg {
            width: 80px; 
            height: 80px;
            fill: #95a5a6;
        }
        h2 {
            font-size: 20px;
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
    </style>
</head>
<body>
<h1>Резюме</h1>

<div class="container">
    <div class="info">
        <div class="section">
            <h2>Имя:</h2>
            <p>${data.firstName} ${data.lastName}</p>
        </div>
        <div class="section">
            <h2>Возраст:</h2>
            <p>${data.age}</p>
        </div>
        <div class="section">
            <h2>Город:</h2>
            <p>${data.city}</p>
        </div>
   </div>
    <div class="photo">
        ${data.photoUrl ? `
            <img src="${data.photoUrl}" alt="User Photo">
        ` : `
            <svg class="placeholder-photo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
            </svg>
        `}
    </div>
</div>
<div class="section">
    <h2>Навыки:</h2>
    <div class="skills">
        ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
</div>

<div class="section">
    <h2>Образование:</h2>
    <p>${data.education || ''}</p>
</div>

<div class="section">
    <h2>Опыт работы:</h2>
    <p>${(data.workExperience || '').replace(/\n/g, '<br>')}</p>
</div>

<div class="section">
    <h2>О себе:</h2>
    <p>${(data.aboutMe || '').replace(/\n/g, '<br>')}</p>
</div>

</body>
</html>
`;
};
