import React from 'react';
import { Globe } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useI18n } from '@/i18n/context';
import { LANGUAGES, Language } from '@/i18n/types';

// SVG flag components for each language/region
const FLAGS: Record<string, React.ReactNode> = {
  'ES': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#c60b1e" d="M0 0h640v480H0z"/><path fill="#ffc400" d="M0 120h640v240H0z"/></svg>,
  'ES-GA': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#0073cf" d="M0 0h320v240H0zm320 240h320v240H320z"/></svg>,
  'ES-AS': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#0073cf" d="M0 0h640v480H0z"/><path fill="#fff200" d="M320 120l30 90-75-55h90l-75 55z"/></svg>,
  'ES-PV': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#d52b1e" d="M0 0h640v480H0z"/><path fill="#009b48" d="M0 160h640v160H0z"/><path fill="#fff" d="M280 0h80v480h-80zM0 200h640v80H0z"/></svg>,
  'ES-CT': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#fcdd09" d="M0 0h640v480H0z"/><path fill="#da121a" d="M0 53h640v53H0zm0 107h640v53H0zm0 106h640v54H0zm0 107h640v54H0z"/></svg>,
  'AD': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#0032a0" d="M0 0h213v480H0z"/><path fill="#fedf00" d="M213 0h214v480H213z"/><path fill="#d1203c" d="M427 0h213v480H427z"/></svg>,
  'GB': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/><path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/><path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/></svg>,
  'FR': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#002395" d="M0 0h213v480H0z"/><path fill="#fff" d="M213 0h214v480H213z"/><path fill="#ed2939" d="M427 0h213v480H427z"/></svg>,
  'DE': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#d00" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>,
  'IT': <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#009246" d="M0 0h213v480H0z"/><path fill="#fff" d="M213 0h214v480H213z"/><path fill="#ce2b37" d="M427 0h213v480H427z"/></svg>,
};

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors flex items-center gap-2" title="Idioma">
          {FLAGS[currentLang?.flag || 'ES'] || <Globe className="w-5 h-5" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 cursor-pointer ${language === lang.code ? 'bg-accent' : ''}`}
          >
            <span className="flex-shrink-0">{FLAGS[lang.flag] || <Globe className="w-5 h-4" />}</span>
            <span>{lang.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
