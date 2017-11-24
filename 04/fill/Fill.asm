// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

(KEYBOARDINTERRUPT)
    @KBD
    D=M
    @SETUPWHITE // white if no keypress
    D;JEQ
    @SETUPBLACK // black if keypress
    D;JNE

(SETUPBLACK)
    // Set pointer to top left of screen
    @SCREEN
    D=A
    @R0
    M=D

    // Set memory space size for screen
    @8096 // (512x32)/16
    D=A
    @R1
    M=D

(FILLBLACK)
    @R0
    A=M  // Manually set address to pointer
    M=-1 // Fill in with 1111111111111111
    @R0
    MD=M+1

    // If screen is filled, go back to listening for keyboard
    @R1
    MD=M-1
    @KEYBOARDINTERRUPT
    D;JEQ

    // Else keep filling black
    @FILLBLACK
    D;JMP

(SETUPWHITE)
    // Set pointer to top left of screen
    @SCREEN
    D=A
    @R0
    M=D

    // Set memory space size for screen
    @8096 // (512x32)/16
    D=A
    @R1
    M=D

(FILLWHITE)
    @R0
    A=M  // Manually set address to pointer
    M=0 // Fill in with 0000000000000000
    @R0
    MD=M+1

    // If screen is filled, go back to listening for keyboard
    @R1
    MD=M-1
    @KEYBOARDINTERRUPT
    D;JEQ

    // Else keep filling white
    @FILLWHITE
    D;JMP
