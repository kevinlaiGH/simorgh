import React from 'react';
import idSanitiser from '#app/lib/utilities/idSanitiser';
import {
  render,
  screen,
  fireEvent,
} from '../react-testing-library-with-providers';
import JumpTo from './index';
import pidginArticleFixtureWithJumpToBlock from './fixtureData';
import * as viewTracking from '../../hooks/useViewTracker';
import * as clickTracking from '../../hooks/useClickTrackerHandler';

describe('JumpTo Component', () => {
  const jumpToBlock =
    pidginArticleFixtureWithJumpToBlock.data.article.content.model.blocks.find(
      block => block.type === 'jumpTo',
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const jumpToHeadings: Array<{ heading: string; sanitisedId?: string }> =
    jumpToBlock?.model.jumpToHeadings ?? [];

  describe('Render jumpTo', () => {
    it('renders the Jump To title', () => {
      render(<JumpTo jumpToHeadings={jumpToHeadings} />);
      const title = screen.getByText('Jump to');
      expect(title).toBeInTheDocument();
    });

    it('renders the correct number of headings without related content link', () => {
      render(<JumpTo jumpToHeadings={jumpToHeadings} />);
      const headings = screen.getAllByRole('listitem');
      expect(headings.length).toBe(jumpToHeadings.length);
    });
    it('renders the correct number of headings with related content link', () => {
      render(<JumpTo jumpToHeadings={jumpToHeadings} showRelatedContentLink />);
      const headings = screen.getAllByRole('listitem');
      expect(headings.length).toBe(jumpToHeadings.length + 1); // related content heading is added into the array inside the component
    });

    it('renders each item with a link to the corresponding subheading on the same page', () => {
      render(<JumpTo jumpToHeadings={jumpToHeadings} showRelatedContentLink />);
      jumpToHeadings.forEach(({ heading, sanitisedId }) => {
        const id = sanitisedId || idSanitiser(heading);
        const link = screen.getByTestId(`jump-to-link-${id}`);
        const expectedHref = `#${id}`;
        expect(link).toHaveAttribute('href', expectedHref);
      });
    });
  });

  describe('Event Tracking', () => {
    const jumpToTrackerData = {
      componentName: 'jumpto',
      optimizely: null,
    };
    describe('View tracking', () => {
      const viewTrackerSpy = jest.spyOn(viewTracking, 'default');
      // jumpToTrackerData is always present on render
      it('should register view tracker with componentName "jumpto"', () => {
        render(<JumpTo jumpToHeadings={jumpToHeadings} />);

        expect(viewTrackerSpy).toHaveBeenCalledWith(jumpToTrackerData);
      });
    });

    describe('Click tracking', () => {
      const clickTrackerSpy = jest
        .spyOn(clickTracking, 'default')
        .mockImplementation();

      it('should register click tracker with componentName "jumpto"', () => {
        render(<JumpTo jumpToHeadings={jumpToHeadings} />);

        expect(clickTrackerSpy).toHaveBeenCalledWith(jumpToTrackerData);
      });
      it('should handle a click event when link clicked', () => {
        clickTrackerSpy.mockRestore();

        render(<JumpTo jumpToHeadings={jumpToHeadings} />);

        jumpToHeadings.forEach(({ heading, sanitisedId }) => {
          const id = sanitisedId || idSanitiser(heading);
          const link = screen.getByTestId(`jump-to-link-${id}`);

          fireEvent.click(link);
          expect(link.onclick).toBeTruthy();
        });
      });
    });
  });
});
