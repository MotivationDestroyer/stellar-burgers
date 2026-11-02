import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { test, expect } from '@playwright/test';

import type { TIngredient } from '../src/utils/types';

const ingredientsHarPath = resolve(process.cwd(), 'tests/hars/ingredients.har');

// Достаём ингредиент из HAR, чтобы сравнивать данные в окне с данными ответа сервера
const getIngredientFromHar = (name: string): TIngredient => {
  const har = JSON.parse(readFileSync(ingredientsHarPath, 'utf-8'));
  const body = JSON.parse(har.log.entries[0].response.content.text);
  const ingredient = (body.data as TIngredient[]).find((item) => item.name === name);

  if (!ingredient) {
    throw new Error(`Ингредиент «${name}» не найден в HAR`);
  }

  return ingredient;
};

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(ingredientsHarPath, { url: '**/api/ingredients' });

    await page.goto('/');
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const modal = page.locator('#modals');
    const modalTitle = modal.getByRole('heading', { name: 'Детали ингредиента' });

    // Проверяем, что до клика модального окна нет
    await expect(modalTitle).not.toBeVisible();

    // Выбираем булку в списке ингредиентов
    const ingredient = page
      .getByRole('link')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();

    await ingredient.click();

    // Проверяем открытие модального окна
    await expect(modalTitle).toBeVisible();

    // Закрываем модальное окно
    await modal.getByRole('button', { name: 'Закрыть' }).click();

    // Проверяем, что окно закрылось
    await expect(modalTitle).not.toBeVisible();
  });

  test('в окне показаны данные выбранного ингредиента', async ({ page }) => {
    // Берём ингредиент не с первой позиции списка
    const name = 'Биокотлета из марсианской Магнолии';
    const { calories, proteins, fat, carbohydrates } = getIngredientFromHar(name);
    const modal = page.locator('#modals');
    const modalTitle = modal.getByRole('heading', { name: 'Детали ингредиента' });

    // Проверяем, что до клика модального окна нет
    await expect(modalTitle).not.toBeVisible();

    await page.getByRole('link').filter({ hasText: name }).first().click();

    await expect(modalTitle).toBeVisible();

    // Проверяем название ингредиента внутри окна
    await expect(modal.getByRole('heading', { name, exact: true })).toBeVisible();

    // Проверяем значения пищевой ценности внутри окна
    const nutritionalValues = [
      { label: 'Калории, ккал', value: calories },
      { label: 'Белки, г', value: proteins },
      { label: 'Жиры, г', value: fat },
      { label: 'Углеводы, г', value: carbohydrates },
    ];

    for (const { label, value } of nutritionalValues) {
      const item = modal.getByRole('listitem').filter({ hasText: label });

      await expect(item.locator('p').first()).toHaveText(label);
      await expect(item.locator('p').nth(1)).toHaveText(String(value));
    }
  });
});
