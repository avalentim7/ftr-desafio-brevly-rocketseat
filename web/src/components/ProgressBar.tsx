import * as Progress from '@radix-ui/react-progress'

interface ProgressBarProps {
  isLoading: boolean
}

export default function ProgressBar({ isLoading }: ProgressBarProps) {
  if (!isLoading) return null

  return (
    <Progress.Root
      className="relative overflow-hidden bg-gray-200 rounded-full w-full h-1"
      style={{
        transform: 'translateZ(0)',
      }}
    >
      <Progress.Indicator
        className="bg-blue-base w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)] animate-progress-indeterminate"
        style={{ transform: 'translateX(-100%)' }}
      />
    </Progress.Root>
  )
}
