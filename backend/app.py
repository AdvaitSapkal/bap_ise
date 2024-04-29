from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# Load the CSV file into a DataFrame
df = pd.read_csv('./bap_ise_data.csv')

@app.route('/query/<column>/<value>')
def query_csv(column, value):
    # Filter DataFrame based on column and value
    filtered_df = df[df[column] == value]
    # Convert filtered DataFrame to JSON
    result = filtered_df.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)