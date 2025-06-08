#!/bin/bash

# Check if module name is provided
if [ -z "$1" ]; then
    echo "Please provide a module name."
    exit 1
fi

MODULE_NAME=$1
CLASS_NAME=$(echo "$MODULE_NAME" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
SRC_DIR="src/$MODULE_NAME/module"

# Create directories if they don't exist
mkdir -p $SRC_DIR

# Create controller file with template code
cat <<EOL > $SRC_DIR/${MODULE_NAME}.controller.ts
import { Request, Response } from 'express';
import ${CLASS_NAME}Service from './${MODULE_NAME}.service';

class ${CLASS_NAME}Controller {
    private readonly ${MODULE_NAME}Service = new ${CLASS_NAME}Service();
    constructor(){
        this.${MODULE_NAME}Service = new ${CLASS_NAME}Service();
    }
    get = async (req: Request, res: Response) => {
        // Implement get logic
    }
}

export default new ${CLASS_NAME}Controller();
EOL

# Create service file with template code
cat <<EOL > $SRC_DIR/${MODULE_NAME}.service.ts
class ${CLASS_NAME}Service {

}

export default ${CLASS_NAME}Service;
EOL

# Create routes file with template code
cat <<EOL > $SRC_DIR/${MODULE_NAME}.routes.ts
import express from 'express';
import ${CLASS_NAME}Controller from './${MODULE_NAME}.controller';
import routeCreator, { HttpMethods, IRoutes } from '../config/routeCreator';

const router = express.Router();

const routes: IRoutes[] = [
  {
    path: '/',
    method: HttpMethods.get,
    middleware: [],
    handler: ${CLASS_NAME}Controller.get,
  },
];

routeCreator(router, routes);

export default router;
EOL

echo "Module $MODULE_NAME created successfully."

# Update main routes file to include the new module routes
MAIN_ROUTES_FILE="src/route.ts"

if ! grep -q "import ${CLASS_NAME}Routes" $MAIN_ROUTES_FILE; then
    # Add import statement for the new module routes
    sed -i "1i import ${CLASS_NAME}Routes from './${MODULE_NAME}/${MODULE_NAME}.routes';" $MAIN_ROUTES_FILE

    # Add route to the ROUTES array
    sed -i "/const ROUTES = \[/a \ \ {\n\ \ \ \ path: '/${MODULE_NAME}',\n\ \ \ \ route: ${CLASS_NAME}Routes,\n\ \ }," $MAIN_ROUTES_FILE
fi

echo "Routes for module $MODULE_NAME added to $MAIN_ROUTES_FILE."