import {z} from "zod";
import {Language} from "../types/enums/language.enam"
import {LanguageLevel} from "../types/enums/language-level.enum"


export const languageSkillSchema = z.object({
    language: z.nativeEnum(Language),
    level: z.nativeEnum(LanguageLevel),
});