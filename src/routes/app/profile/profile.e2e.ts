import { expect, test } from '@playwright/test';

test('unauthenticated users are redirected to login', async ({ page }) => {
	await page.goto('/app/profile');

	await expect(page).toHaveURL(/\/auth\/login$/);
	await expect(page.getByText('Login', { exact: true }).first()).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Email or Username' })).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
});
