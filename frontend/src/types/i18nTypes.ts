import { useTranslation } from "react-i18next";
import en from "../locales/English/translation.json";
import i18n from "../misc/i18n";

type TranslationSchema = typeof en;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6];

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type NestedKeys<T, D extends number = 6> = [D] extends [never]
  ? never
  : T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? Join<K, NestedKeys<T[K], Prev[D]>>
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeys<TranslationSchema>;

export function t(
  key: TranslationKey,
  options?: Record<string, unknown>
): string {
  return i18n.t(key, options);
}

export function useT(): {
  (key: TranslationKey, options?: Record<string, unknown>): string;
  (key: string, options?: Record<string, unknown>): string;
} {
  const { t } = useTranslation();

  return (key: string, options?: Record<string, unknown>) => t(key, options);
}
