import { resolve } from 'node:path';

import { test, expect } from '@playwright/test';

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(
      resolve(process.cwd(), 'tests/hars/ingredients.har'),
      { url: '**/api/ingredients' }
    );

    await page.goto('/');
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    // Выбираем булку в списке ингредиентов
    const ingredient = page
      .getByRole('link')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();

    await ingredient.click();

    // Проверяем открытие модального окна
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    // Проверяем название ингредиента
    await expect(
      page.getByRole('heading', {
        name: 'Краторная булка N-200i',
        exact: true
      })
    ).toBeVisible();

    // Проверяем отображение пищевой ценности
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();

    // Закрываем модальное окно
    await page.getByRole('button', { name: 'Закрыть' }).click();

    // Проверяем, что окно закрылось
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });
});
