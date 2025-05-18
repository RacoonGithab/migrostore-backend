import {GeneratePdfResumeDto} from "../../types/dto/resume.dto";

export const createResumeHtmlTemplate = (data: GeneratePdfResumeDto): string => {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Резюме</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        h1 {
            text-align: center;
            font-size: 32px;
            margin-bottom: 20px;
            color: #222;
        }
        .container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
        }
        .info {
            flex: 1;
        }
        .photo img {
            max-width: 150px;
            height: auto;
            border-radius: 10px;
            border: 2px solid #ddd;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h2 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #444;
        }
        p {
            margin: 0 0 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            margin-bottom: 5px;
        }
        .section:last-child {
            margin-bottom: 0;
        }
        .page-break {
            page-break-before: always;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill {
            background-color: #007bff;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
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
        <img src="data:image/jpeg;base64,${data.photo}" alt="User Photo">
    </div>
</div>

<div class="section">
    <h2>Образование:</h2>
    <p>${data.education}</p>
</div>

<div class="section">
    <h2>Опыт работы:</h2>
    <p>${data.workExperience}</p>
</div>

<div class="section">
    <h2>О себе:</h2>
    <p>${data.aboutMe}</p>
</div>

<div class="section">
    <h2>Навыки:</h2>
    <div class="skills">
        ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
</div>

</body>
</html>
`;
};
