import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PassengerNumberInput } from '../../src/components/PassengerNumberInput'
import { render, screen } from '@testing-library/react'

const mockSetNumPas = vi.fn<[number], void>()

describe('PassangerNumberInput', async () => {
  it('renders with base input', async () => {
    render(<PassengerNumberInput numOfPassengers={1} setNumOfPassengers={() => { }} />)

    const title = await screen.findByText('Number of passengers')
    const numOfPassengers = await screen.findByText('1')
    expect(title).toBeTruthy()
    expect(numOfPassengers).toBeTruthy()
  })

  it('increments', async () => {
    render(<PassengerNumberInput numOfPassengers={1} setNumOfPassengers={mockSetNumPas} />)

    const incrementBttn = await screen.findByText('+')

    incrementBttn.click()

    expect(mockSetNumPas).toBeCalledWith(2)
  })

  it('decrements to 1', async () => {
    render(<PassengerNumberInput numOfPassengers={2} setNumOfPassengers={mockSetNumPas} />)

    const decrementBttn = await screen.findByText('-')

    decrementBttn.click()

    expect(mockSetNumPas).toBeCalledWith(1)

    decrementBttn.click()

    expect(mockSetNumPas).toBeCalledWith(1)
  })
})