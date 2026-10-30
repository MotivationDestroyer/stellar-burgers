import { BurgerIngredientsUI } from '@ui';
import { useEffect, useRef, useState } from 'react';

import { useSelector } from '../../services/store';

import type { TTabMode } from '@utils-types';

export const BurgerIngredients = (): React.JSX.Element => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  const onTabClick = (tab: string): void => {
    const refs: Record<TTabMode, React.RefObject<HTMLHeadingElement | null>> = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef,
    };

    const selectedTab = tab as TTabMode;
    setCurrentTab(selectedTab);

    refs[selectedTab].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const headings: { tab: TTabMode; element: HTMLHeadingElement | null }[] = [
      { tab: 'bun', element: titleBunRef.current },
      { tab: 'main', element: titleMainRef.current },
      { tab: 'sauce', element: titleSaucesRef.current },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a: IntersectionObserverEntry, b: IntersectionObserverEntry): number =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0) {
          const heading = headings.find((item) => item.element === visible[0].target);

          if (heading) {
            setCurrentTab(heading.tab);
          }
        }
      },
      {
        root: document.querySelector('[class*="content"]'),
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      onTabClick={onTabClick}
    />
  );
};
