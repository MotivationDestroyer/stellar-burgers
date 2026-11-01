import type { TIngredient, TTabMode } from '@utils-types';
import type { RefObject } from 'react';

export type BurgerIngredientsUIProps = {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement | null>;
  titleMainRef: RefObject<HTMLHeadingElement | null>;
  titleSaucesRef: RefObject<HTMLHeadingElement | null>;
  onTabClick: (val: string) => void;
};
