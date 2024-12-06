// @ts-ignore

import { defineCustomEventMessaging } from '@webext-core/messaging/page';

export interface WebsiteMessengerSchema {
  init(data: unknown): void;
  somethingHappened(data: unknown): void;
}

export const websiteMessenger = defineCustomEventMessaging<WebsiteMessengerSchema>({
  namespace: '<some-unique-string>',
});