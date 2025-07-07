import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
import { Modal } from "../modals/modal";
import LabelStyle from "../../style/label.style";

interface TextfieldListProps {
  valuesToDisplay: string[];
  onClicked: (value: string) => void;
  label: string;
  defaultValue?: string;
}

const Cell = styled.div<{ $isSelected?: boolean }>(({ theme, $isSelected = false }) => [
  tw`
        rounded
        p-1.5
        font-inter
        text-sm
        font-medium
        cursor-pointer
        select-none
        transition-all
        duration-200
    `,
  css`
    color: ${$isSelected ? theme.buttonText : theme.blue500};
    background-color: ${$isSelected ? theme.blue500 : 'transparent'};

    &:hover {
      background-color: ${$isSelected ? theme.blue600 : theme.blue100};
      color: ${$isSelected ? theme.buttonText : theme.blackColor};
    }
  `,
]);

const DropdownButton = styled.div<{ $isOpen?: boolean }>(({ theme, $isOpen = false }) => [
  tw`
    flex
    border
    border-solid
    bg-white
    justify-between
    items-center
    rounded-lg
    p-3
    cursor-pointer
    transition-all
    duration-200
    select-none
   relative
   z-10
  `,
  css`
    border-color: ${$isOpen ? theme.blue500 : theme.borderColor};
    box-shadow: ${$isOpen ? `0 0 0 2px ${theme.blue100}` : 'none'};
    
    &:hover {
      border-color: ${theme.blue500};
    }
  `,
]);

export const TextfieldList: React.FC<TextfieldListProps> = ({
  valuesToDisplay,
  onClicked,
  label,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || valuesToDisplay[0]
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Update selected value when defaultValue changes
  useEffect(() => {
    if (defaultValue && defaultValue !== selectedValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const handleCellClick = (value: string) => {
    onClicked(value);
    setSelectedValue(value);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col w-full relative z-20" ref={containerRef}>
      {label && <LabelStyle>{label}</LabelStyle>}
      
      <DropdownButton 
        onClick={toggleDropdown}
        $isOpen={isOpen}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(e as any);
          }
        }}
      >
        <span className="text-textfield-color font-inter text-sm select-none">
          {selectedValue}
        </span>
        <KeyboardArrowDownIcon 
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </DropdownButton>
      
      {isOpen && (
        <Modal 
          onClose={() => setIsOpen(false)} 
          fullWidth
        >
          <div role="listbox" aria-label={label} className="relative z-[10001]">
            {valuesToDisplay.map((element, index) => (
              <Cell 
                key={index} 
                onClick={() => handleCellClick(element)}
                $isSelected={element === selectedValue}
                role="option"
                aria-selected={element === selectedValue}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick(element);
                  }
                }}
              >
                {element}
              </Cell>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TextfieldList;