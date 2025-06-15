
export const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


export const formatDate = (date: Date | null): string => {
    if (!date) return 'Настоящее время';
    const d = new Date(date);

    return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
};

