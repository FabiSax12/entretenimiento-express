import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return null;
  return <>
    <div className="flex h-full w-full items-center justify-center">
      <div className="grid h-full w-full gap-4  p-2 grid-cols-6 grid-rows-2 ">
        {
          // 1st row
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="col-span-2 row-span-1 flex items-center justify-center"
            >
              <BentoCard />
            </div>
          ))
        }
        {
          // 2nd row
          [4, 5].map((i) => (
            <div
              key={i}
              className="col-span-3 row-span-1 flex items-center justify-center"
            >
              <BentoCard />
            </div>
          ))
        }
      </div>
    </div>

  </>
}

function BentoCard() {
  return (
    <Card className='w-full h-full'>
      <CardHeader>
        <h2 className='text-xl font-bold'>Card 1</h2>
      </CardHeader>
      <CardBody>
        <p>Content 1</p>
      </CardBody>
      <CardFooter>
        <Button color='primary' size='sm'>Button 1</Button>
      </CardFooter>
    </Card>
  )
}
