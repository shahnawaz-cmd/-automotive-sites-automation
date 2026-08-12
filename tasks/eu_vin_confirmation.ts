import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class EuVinConfirmationTask {
  async performAs(actor: Actor) {
    const page = actor.getPage();

    await page.getByRole('button', { name: 'No' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Select Year' }).click();
    await page.getByRole('button', { name: '2015' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Select Make' }).click();
    await page.getByRole('button', { name: 'Alfa Romeo' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Select Model' }).click();
    await page.getByRole('button', { name: 'Giulietta II' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Select Trim' }).click();
    await page.getByRole('button', { name: '1.4 GLP Turbo 120HP' }).click();
    await page.getByRole('button', { name: 'Update Vehicle Details' }).click();

    await page.waitForTimeout(2000);
    console.log('✅ EU VIN details updated');
  }
}
