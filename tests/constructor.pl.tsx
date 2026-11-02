import { resolve } from 'node:path';

import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(resolve(process.cwd(), 'tests/hars/ingredients.har'), {
      url: '**/api/ingredients',
    });

    await page.routeFromHAR(resolve(process.cwd(), 'tests/hars/user.har'), {
      url: '**/api/auth/user',
    });

    await page.routeFromHAR(resolve(process.cwd(), 'tests/hars/order.har'), {
      url: '**/api/orders',
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      document.cookie = 'accessToken=fake-access-token; path=/';
    });

    await page.goto('/');
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    // Находим конструктор и элементы, которые должны в нём появиться
    const burgerConstructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });

    const bunTop = burgerConstructor.getByText('Краторная булка N-200i (верх)', {
      exact: true,
    });
    const bunBottom = burgerConstructor.getByText('Краторная булка N-200i (низ)', {
      exact: true,
    });
    const main = burgerConstructor
      .locator('ul')
      .getByText('Биокотлета из марсианской Магнолии');

    // Проверяем, что до клика булки и начинки в конструкторе нет
    await expect(bunTop).not.toBeVisible();
    await expect(bunBottom).not.toBeVisible();
    await expect(main).not.toBeVisible();

    // Добавляем булку
    const bunCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Добавляем начинку
    const mainCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем добавление булки сверху и снизу
    await expect(bunTop).toBeVisible();
    await expect(bunBottom).toBeVisible();

    // Проверяем добавление начинки
    await expect(main).toBeVisible();
  });
});
