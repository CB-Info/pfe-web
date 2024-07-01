import { render, screen } from '@testing-library/react';
import CustomButton, { TypeButton, WidthButton } from '../UI/components/buttons/custom.button';

test('renders learn react link', () => {
    render(<CustomButton type={TypeButton.PRIMARY} onClick={() => {}} width={WidthButton.LARGE} isLoading={false}>
        Hello World
    </CustomButton>);
    const linkElement = screen.getByText(/hello world/i);
    expect(linkElement).toBeInTheDocument();
});