import React from 'react';
import {
  render,
  screen,
} from '../../../components/react-testing-library-with-providers';
import Promo from '.';
// eslint-disable-next-line react/prop-types
const Fixture = ({ useLargeImages = false, timestamp = new Date() }) => (
  <Promo>
    <Promo.Image
      useLargeImages={useLargeImages}
      src="https://ichef.test.bbci.co.uk/news/{width}/cpsdevpb/3502/test/0c533a40-770b-11ed-bd83-8f15ba358e41.jpg"
      alt="Test image alt text"
      loading="lazy"
    />
    <Promo.Heading>test heading</Promo.Heading>
    <Promo.A>test link tag</Promo.A>
    <Promo.Body>test body</Promo.Body>
    <Promo.Timestamp>{timestamp}</Promo.Timestamp>
  </Promo>
);

// eslint-disable-next-line react/prop-types
const FixtureProgrammes = ({ useLargeImages = false }) => (
  <Promo>
    <Promo.Image
      useLargeImages={useLargeImages}
      src="https://ichef.bbci.co.uk/images/ic/{width}xn/p06vzdgj.jpg"
      alt="Test image alt text"
      loading="lazy"
    />
    <Promo.Heading>test heading</Promo.Heading>
    <Promo.A>test link tag</Promo.A>
    <Promo.Body>test body</Promo.Body>
  </Promo>
);

describe('Promo component - Image', () => {
  it('should render image using correct resolution and no large image on desktop', () => {
    render(<Fixture />);
    const imageEl = screen.getByAltText('Test image alt text');
    expect(imageEl).toHaveAttribute(
      'sizes',
      `(min-width: 63rem) 232px, (min-width: 37.5rem) 50vw, 33vw`,
    );
  });
  it('should use large image resolution and width when large image is true', () => {
    render(<Fixture useLargeImages />);
    const imageEl = screen.getByAltText('Test image alt text');
    expect(imageEl).toHaveAttribute(
      'sizes',
      `(min-width: 63rem) 660px, (min-width: 37.5rem) 50vw, 33vw`,
    );
  });

  it('should create src set using correct resolutions - programmes iChef recipes ', () => {
    render(<FixtureProgrammes />);

    const image = screen.getByAltText('Test image alt text');
    const srcSet = image.getAttribute('srcSet');

    const expectedResolutions = [96, 128, 176, 240, 352, 464, 672];
    expectedResolutions.forEach(resolution => {
      expect(srcSet).toContain(`${resolution}w`);
    });
  });

  it('should create src set using resolutions - all other iChef Recipes', () => {
    render(<Fixture />);

    const image = screen.getByAltText('Test image alt text');
    const srcSet = image.getAttribute('srcSet');

    const expectedResolutions = [85, 120, 170, 232, 325, 450, 660];
    expectedResolutions.forEach(resolution => {
      expect(srcSet).toContain(`${resolution}w`);
    });
  });
});

describe('Promo component - Timestamp', () => {
  describe('Past dates', () => {
    it('should render timestamp in string format', () => {
      const stringTimestamp = '2023-11-03T05:17:09.393Z';
      const { getByText } = render(<Fixture timestamp={stringTimestamp} />, {
        service: 'mundo',
      });
      expect(getByText('3 noviembre 2023')).toBeInTheDocument();
    });
    it('should render timestamp in epoch format', () => {
      const unixTimestamp = 1698995115000;
      const { getByText } = render(<Fixture timestamp={unixTimestamp} />, {
        service: 'mundo',
      });
      expect(getByText('3 noviembre 2023')).toBeInTheDocument();
    });
  });

  describe('Relative times', () => {
    const epochTimeNow = Date.now();

    const calcTimestampMinutesAgo = minutes =>
      new Date(epochTimeNow - 60 * 1000 * minutes);

    const calcTimestampHoursAgo = hours =>
      new Date(epochTimeNow - 60 * 60 * 1000 * hours);
    describe('Relative time 0 minute ago', () => {
      it('should render 1 minute ago in string format if time since last published is less than 1 minute ago', () => {
        // We do not want the timestamp to say 0 minutes if time since last published is less than 1 minute ago.
        // Relative time stamp will say 1 minute ago for last published between 0 minutes and 1.59 minutes
        const zeroMinuteAgoString = calcTimestampMinutesAgo(0).toISOString();
        const { getByText } = render(
          <Fixture timestamp={zeroMinuteAgoString} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('1 minuto')).toBeInTheDocument();
      });
      it('should render 1 minute ago in epoch format if time since last published is less than 1 minute ago', () => {
        const zeroMinuteAgoEpoch = calcTimestampMinutesAgo(0).getTime();
        const { getByText } = render(
          <Fixture timestamp={zeroMinuteAgoEpoch} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('1 minuto')).toBeInTheDocument();
      });
    });
    describe('Relative time 59 minutes ago', () => {
      it('should render 59 minutes ago or less in string format', () => {
        const fiftyNineMinutesAgoString =
          calcTimestampMinutesAgo(59).toISOString();
        const { getByText } = render(
          <Fixture timestamp={fiftyNineMinutesAgoString} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('59 minutos')).toBeInTheDocument();
      });
      it('should render 59 minutes ago or less in epoch format', () => {
        const fiftyNineMinutesAgoEpoch = calcTimestampMinutesAgo(59).getTime();
        const { getByText } = render(
          <Fixture timestamp={fiftyNineMinutesAgoEpoch} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('59 minutos')).toBeInTheDocument();
      });
    });
    describe('Relative time 10 hours ago', () => {
      it('should render 10 hours ago or less in string format', () => {
        const tenHoursAgoString = calcTimestampHoursAgo(10).toISOString();
        const { getByText } = render(
          <Fixture timestamp={tenHoursAgoString} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('10 horas')).toBeInTheDocument();
      });
      it('should render 10 hours ago or less in epoch format', () => {
        const tenHoursAgoEpoch = calcTimestampHoursAgo(10).getTime();
        const { getByText } = render(<Fixture timestamp={tenHoursAgoEpoch} />, {
          service: 'mundo',
        });
        expect(getByText('10 horas')).toBeInTheDocument();
      });
    });
    describe('Relative time more than 11 hours ago', () => {
      it('should render timestamp in ISO string format', () => {
        const overElevenHoursString = calcTimestampHoursAgo(11).toISOString();
        const { getByText } = render(
          <Fixture timestamp={overElevenHoursString} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('6 noviembre 2023')).toBeInTheDocument();
      });
      it('should render timestamp in ISO format', () => {
        const overElevenHoursEpoch = calcTimestampHoursAgo(11).getTime();
        const { getByText } = render(
          <Fixture timestamp={overElevenHoursEpoch} />,
          {
            service: 'mundo',
          },
        );
        expect(getByText('6 noviembre 2023')).toBeInTheDocument();
      });
    });
  });
});
