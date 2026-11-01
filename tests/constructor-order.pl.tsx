import { resolve } from 'node:path';

import { test, expect } from '@playwright/test';

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(
  resolve(process.cwd(), 'tests/hars/ingredients.har'),
  { url: '**/api/ingredients' }
);

await page.routeFromHAR(
  resolve(process.cwd(), 'tests/hars/user.har'),
  { url: '**/api/auth/user' }
);

await page.routeFromHAR(
  resolve(process.cwd(), 'tests/hars/order.har'),
  { url: '**/api/orders' }
);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      document.cookie = 'accessToken=fake-access-token; path=/';
    });

    await page.goto('/');
  });

  test('успешное оформление заказа', async ({ page }) => {
    // Добавляем булку
    const bunCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Добавляем начинку
    const mainCard = page
      .getByRole('listitem')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      })
      .first();

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем появление номера заказа
    await expect(page.getByText('12345', { exact: true })).toBeVisible();

    // Проверяем сообщение об оформлении заказа
    await expect(
      page.getByText('идентификатор заказа')
    ).toBeVisible();

    await expect(
      page.getByText('Ваш заказ начали готовить')
    ).toBeVisible();

    // Проверяем очистку конструктора
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await expect(
      page.getByText('Выберите начинку')
    ).toBeVisible();

    // Закрываем модальное окно
    await page.getByRole('button', { name: 'Закрыть' }).click();

    // Проверяем закрытие окна
    await expect(
      page.getByText('12345', { exact: true })
    ).not.toBeVisible();
  });
});
