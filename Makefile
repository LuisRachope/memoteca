# Commands

exec:
	ng serve

exec_with_open:
	ng serve --open

exec_generate_component:
	@if [ -z "$(name)" ]; then \
		echo "Error: Component name not provided. Use 'make generate-component name=<component-name>'"; \
		exit 1; \
	fi
	ng generate component $(name)   
