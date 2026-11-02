import { resolve } from 'node:path';

import { test, expect } from '@playwright/test';

test.describe('Оформление заказа', () => {
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

  test('успешное оформление заказа', async ({ page }) => {
    // Находим конструктор и контейнер модальных окон
    const burgerConstructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });
    const modals = page.locator('#modals');

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

    // Проверяем, что бургер собран, а окна с номером заказа ещё нет
    await expect(
      burgerConstructor.getByText('Краторная булка N-200i (верх)', { exact: true })
    ).toBeVisible();
    await expect(
      burgerConstructor.getByText('Краторная булка N-200i (низ)', { exact: true })
    ).toBeVisible();
    await expect(
      burgerConstructor.locator('ul').getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
    await expect(burgerConstructor.getByText('Выберите булки')).toHaveCount(0);
    await expect(burgerConstructor.getByText('Выберите начинку')).toHaveCount(0);
    await expect(modals.getByText('12345', { exact: true })).not.toBeVisible();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем появление номера заказа в модальном окне
    await expect(modals.getByText('12345', { exact: true })).toBeVisible();

    // Проверяем сообщение об оформлении заказа в модальном окне
    await expect(modals.getByText('идентификатор заказа')).toBeVisible();
    await expect(modals.getByText('Ваш заказ начали готовить')).toBeVisible();

    // Проверяем очистку конструктора
    await expect(burgerConstructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(burgerConstructor.getByText('Выберите начинку')).toBeVisible();
    await expect(
      burgerConstructor.getByText('Краторная булка N-200i (верх)', { exact: true })
    ).not.toBeVisible();

    // Закрываем модальное окно
    await modals.getByRole('button', { name: 'Закрыть' }).click();

    // Проверяем закрытие окна
    await expect(modals.getByText('12345', { exact: true })).not.toBeVisible();
  });
});
