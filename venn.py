# Venn
# A Puzzle Game by Zoltan Talaber


# A node is a basic unit, a "square", that holds a value and may or may not be movable by the player
class Node(object):
    #  1 for white square
    # -1 for black square
    value = 0
    # 1 for movable
    # 0 for immovable
    mobility = -1

    def __init__(self, value, mobility):
        self.value = value
        self.mobility = mobility

    def __str__(self):
        appearance = ""

        if self.value == -1:
            appearance += "-"
        elif self.value == 1:
            appearance += "+"
        else:
            appearance += "Z"

        if self.mobility == 0:
            appearance = "[" + appearance + "]"
        elif self.mobility == 1:
            appearance = "(" + appearance + ")"
        else:
            appearance = "\"" + appearance + "\""

        return appearance


# Create nodes of a certain type
def create_group(num_nodes, val, mob):
    node_list = []
    for i in range(num_nodes):
        new_node = Node(val, mob)
        node_list.append(new_node)
        # print(str(new_node), end='')
    return node_list


# Creates a dictionary containing the data of each circle
# Key-value pair = node type: list of those individual nodes
def create_circle(circle):
    group_list = {
        "hw": create_group(circle[0], 1, 0),
        "sw": create_group(circle[1], 1, 1),
        "hb": create_group(circle[2], -1, 0),
        "sb": create_group(circle[3], -1, 1)
    }
    return group_list


# Creates a level of Venn
# Pass in two lists, one for each circle
# This method will create a node for each square
def create_level(lcircle, rcircle):
    # Left circle node creation
    left = create_circle(lcircle)
    # Right circle node creation
    right = create_circle(rcircle)
    # Put circles together to form full level
    created_level = [left, right]
    return created_level


# Display game state
def display_game(level):
    print("_______________")

    for circle in level:
        for group in circle.keys():
            for node in circle[group]:
                print(str(node), end='')
        print("\n_______________")

    print("")


# Prints out instructions on how to play Venn using the ASCII interface
def print_instructions():
    print("There are two rows in each stage. Find balance between rows to win.")
    print("Press \"q\" to quit")


# Print Level Entrance Greetings
def level_entrance(num_level):
    print("Welcome to level " + str(num_level))


# Modifies the game state based on player input, then checks if new game state is a win state
def change_level(level):
    won = False
    while not won:
        # Checks for user input
        # "d" for moving a black from left to right circle (bottom row)
        # "f" for moving a white from left to right circle (bottom row)
        # "j" for moving a white from right to left circle (top row)
        # "k" for moving a black from right to left circle (top row)
        print("Enter input: ", end=' ')
        move = input()
        if move == "d" and len(level[0]["sb"]) > 0:
            temp_node = level[0]["sb"].pop()
            level[1]["sb"].append(temp_node)
        elif move == "f" and len(level[0]["sw"]) > 0:
            temp_node = level[0]["sw"].pop()
            level[1]["sw"].append(temp_node)
        elif move == "j" and len(level[1]["sw"]) > 0:
            temp_node = level[1]["sw"].pop()
            level[0]["sw"].append(temp_node)
        elif move == "k" and len(level[1]["sb"]) > 0:
            temp_node = level[1]["sb"].pop()
            level[0]["sb"].append(temp_node)
        elif move == "i":
            print_instructions()
        elif move == "q":
            quit()
        else:
            print("Invalid input!")

        # Now display new game state
        display_game(level)
        # print(level)

        # Determine if level is won by checking if the total value in each circle matches
        totalA = 0
        totalB = 0
        for group in level[0].keys():
            for node in level[0][group]:
                totalA += node.value
        for group in level[1].keys():
            for node in level[1][group]:
                totalB += node.value
        if totalA == totalB:
            won = True


# ------------------------------------LEVELS-----------------------------------------

# Level 1 Initializes
# [number of hard whites, number of soft whites, number of hard blacks, number of soft blacks]
def level1():
    level_entrance(1)
    print("Press \"f\" to move a (+) from the top row to the bottom row")
    print("Press \"j\" to move a (+) from the bottom row to the top row")
    level = create_level([0, 2, 0, 0], [0, 0, 0, 0])
    display_game(level)
    change_level(level)


def level2():
    level_entrance(2)
    level = create_level([0, 4, 0, 0], [0, 0, 0, 0])
    display_game(level)
    change_level(level)


def level3():
    level_entrance(3)
    print("Units in brackets cannot be moved")
    level = create_level([2, 1, 0, 0], [1, 0, 0, 0])
    display_game(level)
    change_level(level)


def level4():
    level_entrance(4)
    print("Ooh! A new unit type.")
    level = create_level([0, 0, 1, 0], [0, 1, 0, 0])
    display_game(level)
    change_level(level)


def level5():
    level_entrance(5)
    print("Use \"d\" and \"k\" to similarly move around (-)")
    level = create_level([0, 0, 1, 1], [1, 1, 0, 0])
    display_game(level)
    change_level(level)


def level6():
    level_entrance(6)
    level = create_level([0, 1, 3, 0], [0, 1, 1, 0])
    display_game(level)
    change_level(level)


def level7():
    level_entrance(7)
    level = create_level([0, 0, 0, 3], [1, 2, 0, 0])
    display_game(level)
    change_level(level)


def level8():
    level_entrance(8)
    level = create_level([0, 0, 0, 5], [0, 1, 0, 0])
    display_game(level)
    change_level(level)


def level9():
    level_entrance(9)
    level = create_level([0, 0, 2, 2], [1, 1, 0, 0])
    display_game(level)
    change_level(level)


def level10():
    level_entrance(10)
    print("Final level of World 1")
    level = create_level([0, 0, 3, 1], [0, 2, 1, 1])
    display_game(level)
    change_level(level)
    print("Congratulations! That's all for now.")


# -------------------------------------MAIN----------------------------------------------------

print("Welcome to Venn\nA Puzzle Game by Zoltan Talaber\n")
print("There are two rows in each stage. Find balance between rows to win.")
print("For additional instructions, press \"i\"\n")

level1()
level2()
level3()
level4()
level5()
level6()
level7()
level8()
level9()
level10()