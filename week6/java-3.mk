javaf = $(wildcard *.java)
classf := $(patsubst %.java, %.class, $(javaf))


$(classf): $(javaf)
	javac $(javaf)

clean:
	rm -f $(classf)

.PHONY: clean