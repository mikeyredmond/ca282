javaf = $(wildcard *.java)
classf = $(patsubst %.java, %.class, $(javaf))

$(classf): $(javaf)
	javac $(javaf)

