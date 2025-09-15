import { Carousel } from '@mantine/carousel';
import { Button, Paper, Text, Title, useMantineTheme, Grid, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { propertyTypes } from '@/constants/propertyTypes';
import classes from './CardsCarousel.module.css';

interface CardProps {
  title: string;
}

function Card({ title }: CardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ 
        backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      className={classes.card}
    >
      <div>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
    </Paper>
  );
}

// Using propertyTypes from constants

export function CardsCarousel() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  
  // Group cards into chunks of 6 (3x2 grid) for desktop, 2 for mobile
  const cardsPerSlide = mobile ? 2 : 6;
  const chunks = [];
  for (let i = 0; i < propertyTypes.length; i += cardsPerSlide) {
    chunks.push(propertyTypes.slice(i, i + cardsPerSlide));
  }

  const slides = chunks.map((chunk, chunkIndex) => (
    <Carousel.Slide key={chunkIndex}>
      <Grid gutter="md">
        {chunk.map((item, index) => (
          <Grid.Col key={item.title} span={mobile ? 6 : 4}>
            <Card {...item} />
          </Grid.Col>
        ))}
      </Grid>
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideGap="xl"
      align="start"
      slidesToScroll={1}
      withIndicators
      withControls
      controlSize={36}
    >
      {slides}
    </Carousel>
  );
}