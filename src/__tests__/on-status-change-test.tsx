import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as TestRenderer from 'react-test-renderer';
import { HelperRouteObject, RouteHelperStatus } from '../types';
import { guardWaitTimeBeforeCheck, mockGuardWorkTime } from './utils/guard-utils';
import { MockAsyncGuard } from './utils/mock-async-guard';
import { MockSyncGuard } from './utils/mock-sync-guard';
import { RoutesRenderer } from './utils/RoutesRenderer';
import { wait } from './utils/wait';

describe('onStatusChange function', () => {
  describe('with sync guards', () => {
    it('for component without guards', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(1);
      expect(statuses.length).toBe(1);
      expect(statuses[0]).toBe(RouteHelperStatus.Loaded);
    });
    it('for component with canActivate true from all 2 guards', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const expectedStatuses = [RouteHelperStatus.Loading, RouteHelperStatus.Loaded];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [new MockSyncGuard(true), new MockSyncGuard(true)],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(10);
      expect(statuses.length).toBe(2);

      statuses.forEach((status, index) => {
        expect(status).toBe(expectedStatuses[index]);
      });
    });
    it('for component with canActivate false from first guard', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const expectedStatuses = [RouteHelperStatus.Loading, RouteHelperStatus.Failed];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [new MockSyncGuard(false), new MockSyncGuard(true)],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(10);
      expect(statuses.length).toBe(2);

      statuses.forEach((status, index) => {
        expect(status).toBe(expectedStatuses[index]);
      });
    });
    it('for component with canActivate false from second guard', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const expectedStatuses = [RouteHelperStatus.Loading, RouteHelperStatus.Failed];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [new MockSyncGuard(true), new MockSyncGuard(false)],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(10);
      expect(statuses.length).toBe(2);

      statuses.forEach((status, index) => {
        expect(status).toBe(expectedStatuses[index]);
      });
    });
  });

  describe('with async guards', () => {
    it('for component with canActivate true from all 2 guards', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const expectedStatuses = [RouteHelperStatus.Loading, RouteHelperStatus.Loaded];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [new MockAsyncGuard(true, mockGuardWorkTime), new MockAsyncGuard(true, mockGuardWorkTime)],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(mockGuardWorkTime * 2 + guardWaitTimeBeforeCheck);
      expect(statuses.length).toBe(2);

      statuses.forEach((status, index) => {
        expect(status).toBe(expectedStatuses[index]);
      });
    });
    it('for component with canActivate false from first guard', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const expectedStatuses = [RouteHelperStatus.Loading, RouteHelperStatus.Failed];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [new MockAsyncGuard(false, mockGuardWorkTime), new MockAsyncGuard(true, mockGuardWorkTime)],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(mockGuardWorkTime + guardWaitTimeBeforeCheck);
      expect(statuses.length).toBe(2);

      statuses.forEach((status, index) => {
        expect(status).toBe(expectedStatuses[index]);
      });
    });
    it('for component with canActivate false from second guard', async () => {
      let renderer: TestRenderer.ReactTestRenderer;

      const statuses: RouteHelperStatus[] = [];
      const expectedStatuses = [RouteHelperStatus.Loading, RouteHelperStatus.Failed];
      const routes: HelperRouteObject[] = [
        {
          path: '/',
          element: <div>Home</div>,
          guards: [new MockAsyncGuard(true, mockGuardWorkTime), new MockAsyncGuard(false, mockGuardWorkTime)],
          onStatusChange: (status: RouteHelperStatus) => {
            statuses.push(status);
          },
        },
      ];

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={['/']}>
            <RoutesRenderer routes={routes} />
          </MemoryRouter>,
        );
      });

      await wait(mockGuardWorkTime * 2 + guardWaitTimeBeforeCheck);
      expect(statuses.length).toBe(2);

      statuses.forEach((status, index) => {
        expect(status).toBe(expectedStatuses[index]);
      });
    });
  });
});